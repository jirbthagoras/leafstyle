import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

interface RecyclingSuggestion {
  title: string;
  description: string;
  value: number; // dalam Rupiah
  difficulty: number; // 1-100
  materials: string[];
  timeRequired: string;
  environmentalBenefit: string;
  safetyTips: string;
}

interface AnalysisResult {
  items: string;
  suggestions: RecyclingSuggestion[];
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
              text: "Sebagai ahli daur ulang di Indonesia, tolong identifikasi dan jelaskan semua barang yang dapat didaur ulang dalam gambar ini. Berikan deskripsi dalam Bahasa Indonesia yang mencakup:\n1. Jenis barang\n2. Kondisi barang\n3. Material utama\n4. Perkiraan ukuran\n\nJika tidak ada barang yang dapat didaur ulang, tulis 'TIDAK_ADA_BARANG_DAUR_ULANG'"
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
    
    // After items analysis
    console.log('Items analysis result:', itemsList);

    // Check if recyclable items were found
    if (itemsList.includes('TIDAK_ADA_BARANG_DAUR_ULANG')) {
      return {
        items: itemsList,
        suggestions: []
      };
    }

    // Modified suggestions prompt
    const suggestions = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Anda adalah ahli daur ulang di Indonesia. Berikan ide kreatif daur ulang dalam format JSON yang valid. Hindari karakter khusus dan gunakan format berikut:
{
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

    // Add JSON string cleanup before parsing
    let parsedSuggestions: RecyclingSuggestion[] = [];
    try {
      const content = suggestions.choices[0]?.message?.content || '';
      
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
    } catch (e) {
      console.error('Failed to parse suggestions:', e);
      parsedSuggestions = [];
    }

    // After suggestions
    console.log('Raw suggestions response:', suggestions.choices[0]?.message?.content);
    console.log('Parsed suggestions:', parsedSuggestions);

    return {
      items: itemsList,
      suggestions: parsedSuggestions
    };
  } catch (error) {
    throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}; 