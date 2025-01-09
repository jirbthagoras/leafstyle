import { Groq } from 'groq-sdk';
import pointService from './PointService';
import { toast } from 'react-toastify';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

interface RecyclingSuggestion {
  title: string;
  description: string;
  value: number;
  difficulty: number;
  materials: string[];
  timeRequired: string;
  environmentalBenefit: string;
  safetyTips: string;
}

interface AnalysisResult {
  items: string;
  suggestions: RecyclingSuggestion[];
  pointsAdded: boolean;
  error?: string;
}

export const analyzeImage = async (imageUrl: string): Promise<AnalysisResult> => {
  try {
    // Analyze recyclable items
    const itemsAnalysis = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Sebagai ahli daur ulang di Indonesia, tolong identifikasi dan jelaskan semua barang yang dapat didaur ulang dalam gambar ini. Berikan deskripsi dalam Bahasa Indonesia yang mencakup:\n1. Jenis barang\n2. Kondisi barang\n3. Material utama\n4. Perkiraan ukuran\n\nJika tidak ada barang yang dapat didaur ulang, tulis 'TIDAK_ADA_BARANG_DAUR_ULANG, dan berikan kesimpulan dari gambar tersebut'"
            },
            {
              type: "image_url",
              image_url: { url: imageUrl }
            }
          ]
        }
      ],
      model: "llama-3.2-90b-vision-preview",
      temperature: 0.7,
      max_tokens: 1000
    });

    const itemsList = itemsAnalysis.choices[0]?.message?.content || '';
    console.log('Items analysis result:', itemsList);

    // Check if recyclable items were found
    if (itemsList.includes('TIDAK_ADA_BARANG_DAUR_ULANG')) {
      return {
        items: itemsList,
        suggestions: []
      };
    }

    let parsedSuggestions: RecyclingSuggestion[] = [];
    let pointAnalysis = 0;

    // Get suggestions and points from AI
    const suggestions = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Anda adalah ahli daur ulang di Indonesia. Berikan ide kreatif daur ulang dalam format JSON yang valid. Hindari karakter khusus dan gunakan format berikut:
{
  "point": 0-100,
  "suggestions": [
    {
      "title": "Nama Proyek",
      "description": "Langkah pembuatan",
      "value": 15000,
      "difficulty": 50,
      "materials": ["bahan1", "bahan2"],
      "timeRequired": "2-3 jam",
      "environmentalBenefit": "manfaat lingkungan",
      "safetyTips": "tips keselamatan"
    }
  ]
}`
        },
        {
          role: "user",
          content: `Barang-barang berikut ditemukan dalam gambar: ${itemsList}. Urutkan dari difficulty terkecil.`
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.5,
      max_tokens: 1500
    });

    try {
      const content = suggestions.choices[0]?.message?.content || '';
      if (!content) {
        toast.error('Tidak ada hasil analisis yang valid', {
          icon: "🤖",
          style: {
            background: "linear-gradient(to right, #ef4444, #dc2626)",
            color: "white",
          }
        });
        return null;
      }
      
      // Find the JSON object in the content
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}') + 1;
      const jsonContent = content.slice(jsonStart, jsonEnd);
      
      // Clean the JSON string
      const cleanContent = jsonContent
        .replace(/[\n\r\t]/g, ' ')
        .replace(/\\/g, '\\\\')
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
        .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas
        .replace(/([{,])\s*}/g, '}')    // Fix empty objects
        .replace(/\s+/g, ' ')           // Normalize whitespace
        .trim();
      
      console.log('Cleaned content:', cleanContent);
      
      // Additional validation
      if (!cleanContent.startsWith('{') || !cleanContent.endsWith('}')) {
        throw new Error('Invalid JSON structure');
      }
      
      const parsed = JSON.parse(cleanContent);
      parsedSuggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];
      pointAnalysis = parsed.point || 0;

      try {
        const remainingScans = await pointService.getRemainingDailyScans();
        let pointsAdded = false;
        
        if (remainingScans > 0) {
          try {
            await pointService.addPoints(
              pointAnalysis,
              `Recycling scan points: ${pointAnalysis}`,
              "SCAN_RECYCLABLE_ITEM"
            );
            pointsAdded = true;
          } catch (pointError) {
            console.log('Could not add points:', pointError);
          }
        }

        return {
          items: itemsList,
          suggestions: parsedSuggestions,
          pointsAdded
        };
      } catch (scanError) {
        // Still return results but indicate points weren't added
        return {
          items: itemsList,
          suggestions: parsedSuggestions,
          pointsAdded: false,
          error: scanError instanceof Error ? scanError.message : 'Unknown error'
        };
      }
    } catch (e) {
      toast.error('Failed to parse suggestions or add points', {
        icon: "❌",
        style: {
          background: "linear-gradient(to right, #ef4444, #dc2626)",
          color: "white",
          borderRadius: "1rem",
        }
      });
      parsedSuggestions = [];
    }

    return {
      items: itemsList,
      suggestions: parsedSuggestions
    };
  } catch (error) {
    toast.error('Gagal menganalisis gambar', {
      icon: "❌",
      style: {
        background: "linear-gradient(to right, #ef4444, #dc2626)",
        color: "white",
      }
    });
    throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}; 