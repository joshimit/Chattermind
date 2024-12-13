import User from "../models/User.js";
import axios from "axios";
import sanitizeHtml from "sanitize-html";
import he from "he"; // Importing HTML Entities decoder library
const PYTHON_API_URL = "http://127.0.0.1:5000/generate"; // Adjust if necessary
export const generateChatCompletion = async (req, res, next) => {
    try {
        const { message, voiceTone = "default" } = req.body;
        // Validation check
        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered or Token malfunctioned" });
        }
        // Call the Python API with voiceTone
        const response = await axios.post(PYTHON_API_URL, { input: message, tone: voiceTone });
        if (response.data.output) {
            // Sanitize the output to strip HTML tags
            const sanitizedOutput = sanitizeHtml(response.data.output, {
                allowedTags: [], // No tags allowed
                allowedAttributes: {}, // No attributes allowed
            });
            // Format the output to handle comments in code without HTML
            const formattedOutput = formatCodeWithComments(sanitizedOutput);
            const assistantMessage = {
                role: "assistant",
                content: formattedOutput,
                tone: voiceTone, // Store tone in the response message
            };
            const userMessage = {
                role: "user",
                content: message,
            };
            user.chats.push(userMessage, assistantMessage); // Save both user and assistant messages
            await user.save();
            return res.status(200).json({ chats: user.chats });
        }
        else {
            console.log("Python API response is invalid");
            return res.status(500).json({ message: "Python API response is invalid" });
        }
    }
    catch (error) {
        console.error("Error in generateChatCompletion:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
// Function to format code output and preserve comments for different languages
function formatCodeWithComments(code) {
    const decodedCode = he.decode(code); // Decode HTML entities
    const lines = decodedCode.split('\n'); // Split code into lines
    const formattedLines = lines.map(line => {
        line = line.trim(); // Trim whitespace
        // Check for comments and format them differently (e.g., with asterisks)
        if (line.startsWith('//')) {
            return `*${line}*`; // Format comment without HTML
        }
        return line; // Return other lines as is
    });
    return formattedLines.join('\n'); // Join back into a single string
}
export const sendChatsToUser = async (req, res) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered" });
        }
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        console.error("Error in sendChatsToUser:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
export const deleteChats = async (req, res) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered" });
        }
        // Clear all chat history
        // user.chats = [];
        await user.save();
        return res.status(200).json({ message: "Chats deleted successfully" });
    }
    catch (error) {
        console.error("Error in deleteChats:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
//# sourceMappingURL=chat-controllers.js.map