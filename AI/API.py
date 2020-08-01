from flask import Flask, jsonify, request
import os
import pickle
import numpy as np
import tensorflow as tf
graph = tf.get_default_graph()


def save_model(filename, model):
    pickle.dump(model, open(filename, 'wb'))


def load_model(filename):
    return pickle.load(open(filename, 'rb'))


app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    response = request.get_json()
    data = list(map(float, response['data']))
    print(data)
    data = np.array([data])

    x = []
    for model in models:
        with graph.as_default():
            pred = model.predict(data)
        print(pred[0][0])
        x.append(float(pred[0][0]))

    return jsonify({'response': x})


@app.route('/hello', methods=['GET'])
def hello():
    return jsonify({'test': 5})


model_folder = "models"
model_list = os.listdir(model_folder)
models = []

for m in model_list:
    if "ann_model" not in m:
        continue
    model_path = os.path.join(model_folder, m)
    models.append(load_model(model_path))

app.run(host="0.0.0.0", port=80,  debug=True)
