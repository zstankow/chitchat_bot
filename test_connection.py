import requests

url1 = 'https://localhost:5000/start_chat'
url2 = 'https://localhost:5000/cont_chat'
# options for level: 'Beginner', 'Intermediate', 'Advanced'

response1 = requests.post(url1, json={
  "language": "spanish",
  "scenario": "buying clothes at a store",
  "level": "Beginner"
})


response2 = requests.post(url2, json={
  "chat_id": '1',
  "message": "Quiero comprar una camisa"
})

pred1 = response1.json()
pred2 = response2.json()

print(pred1, '\n', pred2)