from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import google.generativeai as genai
import markdown2  # To convert markdown to HTML

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Get the API key from environment variable
api_key = os.getenv("GOOGLE_API_KEY")

# Configure the Gemini API
genai.configure(api_key=api_key)

@app.route('/generate', methods=['POST'])
def generate_response():
    input_data = request.json.get('input')
    
    # Start a new chat without history
    model = genai.GenerativeModel("gemini-pro")
    chat = model.start_chat(history=[])
    
    # Send a message and get the response (without streaming)
    response = chat.send_message(input_data)
    
    # Collect and join the response text
    output = "".join(chunk.text for chunk in response)
    
    # Convert markdown to HTML
    html_output = markdown2.markdown(output)
    
    # Return HTML response with proper content type
    return jsonify({"output": html_output})

if __name__ == '__main__':
    app.run(port=5000)
