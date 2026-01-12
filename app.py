from flask import Flask, request, jsonify, render_template
import json

app = Flask(__name__)

# ---------- Helpers ----------
def load_users():
    #Should I import os and do if os.path exists the json file?
    with open("users.json", "r", encoding = "utf-8") as f:
        return json.load(f)
    
def save_users(users):
    with open("users.json", "w", encoding = "utf-8") as f:
        json.dump(users, f)#dumps new all users to the json file.

def load_notes():
    """Read in the json file and convert to a python dictionary."""
    with open("notes_data.json", "r", encoding = "utf-8") as f:
        return json.load(f)
    
def save_notes(notes):
    with open("notes_data.json", "w", encoding="utf-8") as f:
        json.dump(notes, f)

# ---------- Routes -----------
@app.route("/")
def index():
    """
    When smbody visits the homepage, flask will execute this function and render index.html.
    If we don't have this function, flask don't know which function to execute and render
    """
    return render_template("index.html")

@app.route("/new_anony_user")
def new_anony_user():
    """If frontend cannot find the user in localStorage, needs to create a new anony username"""
    all_users = load_users()
    new_anony_userid = len(all_users) + 1
    new_anony_username = f'Anony{new_anony_userid:03d}'
    all_users.append({"username": new_anony_username})
    save_users(all_users)
    return jsonify({"username": new_anony_username})

@app.route("/note", methods = ["GET"])
def read_note():
    """this is like the GET request (well, exactly the GET request), the browser 'get' data from backend to display"""
    notes = load_notes()
    return jsonify(notes)

@app.route("/note", methods = ["POST"])
def write_note():
    data = request.json # chatgpt: {"text": "xxxx"} from frontend
    username = data.get("username", "Anony000")
    text = data.get("text", ["placeholder, meaning errorrrrrr!"])

    notes = []
    for line in text:
        notes.append({
            "username": username, 
            "text": line
        })
    save_notes(notes)
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(debug = True)