from openai import OpenAI
import yaml


with open('config.yaml') as f:
    config_yaml = yaml.load(f, Loader=yaml.FullLoader)
api_key = config_yaml['token']
client = OpenAI(api_key=api_key)

# roles: system, user, assistant
# system - sets the behavior of the assistant (tells them what they are)
# user - provides requests or comments for the assistant to respond to
# assistant - stores previous assistant responses

class Chatbot:
    def __init__(self, api_key):
        self.model = OpenAI(api_key=api_key)
        self.conversation_history = []

    def initiate_conversation(self, language, scenario, level):
        self.language = language
        self.scenario = scenario
        self.level = level

        if self.level == 'Beginner':
            level_req = '''use an extremely simple and limited vocabulary and sentence structure. You must avoid 
        expressions, slang, or complex grammar. You will be penalized for using highly technical language. 
        You must use present tense only. You will be penalized for using past tenses or present tenses. You must keep
        your responses short. You will be penalized if your response is longer than two short sentences.'''

        elif self.level == 'Intermediate':
            level_req = '''use a simple range of vocabulary and sentence structure. You can use some very common
        expressions or slang terms, but avoid highly technical language or nuanced sentences. 
        You must use present or past tenses only. You will be penalized for using future tenses. You must keep your 
        responses short. You will be penalized if your response is longer than two sentences.'''

        elif self.level == 'Advanced':
            level_req = '''use a wide range of vocabulary and sentence structure. You can use
        expressions, slang terms, and highly technical language where you find it appropriate in the conversation. 
        The conversation does not need to be complicated if there is no reason to be complicated.
        You can use present, past, or future tenses.'''

        else:
            level_req = '''use simple and limited vocabulary and sentence structure. Must avoid expressions, 
        slang, or complex grammar. Must avoid highly technical language. Use present tense only.'''

        prompt = f'''
        ###Instruction### Your task is to simulate a typical conversation while {self.scenario}. Your role in this 
        scenario is to be only one of the typical roles in this scenario. I have a different but also typical role in 
        this scenario. You will be penalized if you answer your own question. The conversation must be conducted in 
        {self.language}. This simulated scenario is designed for {self.language} students to learn how to converse 
        in {self.language} while {self.scenario}.
        You may correct spelling mistakes, but then you need to continue the conversation as if the mistake 
        did not occur. You should assume the student's level in {self.language} is a {self.level} level. Therefore,
        you must {level_req}. You must respond in a natural, human-like manner.
        You are the one starting the conversation. You will be penalized if you create a dialogue of both parties. 
        You must only act as your single role. You must keep your response short, but keep the conversation going 
        by asking questions.
        '''

        return prompt.strip()

    def add_message_to_conversation_history(self, message):
        self.conversation_history.append(message[0])

    def continue_conversation(self, message):
        user_message = [
            {'role': 'user', 'content': message}
        ]
        self.add_message_to_conversation_history(user_message)

        ans = self.model.chat.completions.create(model='gpt-3.5-turbo-0125',
                                                 messages=self.conversation_history,
                                                 max_tokens=100,
                                                 temperature=0.7)
        response = ans.choices[0].message.content
        gpt_message = [
            {'role': 'system', 'content': response}
        ]
        self.add_message_to_conversation_history(gpt_message)
        return response
