from flask import Flask, render_template, request, jsonify
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is missing in .env file")

client = genai.Client(api_key=api_key)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message", "").strip()

        if not user_message:
            return jsonify({"reply": "Please enter a message."})

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=user_message
        )

        return jsonify({"reply": response.text})

    except Exception as e:
        print("GEMINI ERROR:", e)
        return jsonify({"reply": "Error: " + str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)