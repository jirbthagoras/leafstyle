import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

interface PostAnalysisResult {
  environmentalImpact: number;
  category: string;
  feedback: string;
  points: number;
}

export const analyzePost = async (content: string): Promise<PostAnalysisResult> => {
  try {
    const analysis = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an environmental impact analyzer. Analyze the following post content and respond ONLY with a valid JSON object in this exact format, nothing else:
{
  "environmentalImpact": <number between 0-100>,
  "category": "<one of: Recycling, Conservation, Education, Awareness, Innovation>",
  "feedback": "<brief feedback about the post>",
  "points": <number between 0-50 based on impact>
}`
        },
        {
          role: "user",
          content: content
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.3,
      max_tokens: 500
    });

    const result = analysis.choices[0]?.message?.content || '';
    
    // Clean and parse the JSON response
    try {
      // Find the JSON object in the content
      const jsonStart = result.indexOf('{');
      const jsonEnd = result.lastIndexOf('}') + 1;
      const jsonContent = result.slice(jsonStart, jsonEnd);
      
      // Clean the JSON string
      const cleanContent = jsonContent
        .replace(/[\n\r\t]/g, ' ')
        .replace(/\\/g, '\\\\')
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
        .replace(/,(\s*[}\]])/g, '$1')
        .replace(/([{,])\s*}/g, '}')
        .replace(/\s+/g, ' ')
        .trim();

      // Additional validation
      if (!cleanContent.startsWith('{') || !cleanContent.endsWith('}')) {
        throw new Error('Invalid JSON structure');
      }

      const parsedResult = JSON.parse(cleanContent);

      // Validate the parsed result has all required fields
      if (!parsedResult.environmentalImpact || !parsedResult.category || 
          !parsedResult.feedback || !parsedResult.points) {
        throw new Error('Missing required fields in analysis result');
      }

      return parsedResult as PostAnalysisResult;
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback response if parsing fails
      return {
        environmentalImpact: 0,
        category: "Uncategorized",
        feedback: "Could not analyze post content",
        points: 0
      };
    }

  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error('Failed to analyze post content');
  }
}; 