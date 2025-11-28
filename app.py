from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route("/")
def index():
    """
    When smbody visits the homepage, flask will execute this function and render index.html.
    If we don't have this function, flask don't know which function to execute and render
    """
    return render_template("index.html")

@app.route("/note", methods = ["GET"])
def read_note():
    #this is like the GET request, the browser 'get' data from backend to display
    with open("notes_data.txt", "r", encoding = "utf-8") as f:
        content = f.read()
    return content

@app.route("/note", methods = ["POST"])
def write_note():
    data = request.json # chatgpt: {"text": "xxxx"} from frontend
    text = data.get("text", "Default value, meaning errorrrrrr") # this would be the 'text' written by the user in frontend
    with open("notes_data.txt", "w", encoding = "utf-8") as f:
        f.write(text)
    return jsonify({"status": "ok"}) # try not jsonify

if __name__ == "__main__":
    app.run(debug = True)