import { GoogleGenerativeAI } from "@google/generative-ai";
// Initialize the Google Generative AI client with your API key
const genAi = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
// Get the generative model
const model = genAi.getGenerativeModel({
    model: "gemini-1.5-pro", // Specify the model you want to use
});
// Function to generate content based on a prompt
const generateContent = async (prompt) => {
    try {
        const response = await model.generateContent(prompt);
        console.log(response); // Log the entire response to understand its structure
    }
    catch (error) {
        console.error("Error generating content:", error);
    }
};
// Example usage
generateContent("Top 10 programming languages");
//# sourceMappingURL=openai-config.js.map