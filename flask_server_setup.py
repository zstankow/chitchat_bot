from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import yaml
from chitchat_bot import Chatbot
import uuid

# Extracting API key
with open('config.yaml') as f:
    config_yaml = yaml.load(f, Loader=yaml.FullLoader)
api_key = config_yaml['token']
bots = {}

# Initialize Flask app
app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/start_chat', methods=['POST'])
def start_chat():
    data = request.get_json()
    language = data['language']
    scenario = data['scenario']
    level = data['level']

    # generate unique chat id
    chat_id = str(uuid.uuid4())

    # initialize instance of Chatbot
    bot = Chatbot(api_key)
    initial_prompt = bot.initiate_conversation(language=language,
                                               scenario=scenario,
                                               level=level)
    response = bot.continue_conversation(initial_prompt)

    # store Chatbot instance in bots dictionary
    bots[chat_id] = bot
    return jsonify({'generated_text': response, 'chat_id': chat_id})


@app.route('/cont_chat', methods=['POST'])
def cont_chat():
    data = request.get_json()
    chat_id = data['chat_id']
    user_message = data['message']

    if chat_id in bots:
        bot = bots[chat_id]
    else:
        return jsonify({'error': 'chat ID not found'})

    response = bot.continue_conversation(user_message)
    return jsonify({'generated_text': response})


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8080)
