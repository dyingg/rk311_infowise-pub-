import keras
from keras.models import Sequential
from keras.layers import Dense
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
import pickle, os
import numpy as np
from Naked.toolshed.shell import muterun_js
import sys
import requests, random
import tensorflow as tf
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'


def save_model(filename, model):
    pickle.dump(model, open(filename, 'wb'))

def load_model(filename):
    return pickle.load(open(filename, 'rb'))


def get_score(ip):
    url = "https://ipqualityscore.com/api/json/ip/F5FEG8NGn0stGDfizWPf7ylxu3iNqnX4/" + ip
    response = requests.get(url).json()
    # print(response)
    return response['fraud_score']


def get_inputs(path, file_name, ip):
    os.chdir(path)
    file = os.path.join(path, file_name)
    x = file_name + ' ' + ip
    output = muterun_js(x)
    s = output.stdout
    s = str(s).strip()[2:-3]
    print(s)
    return s


def retrain(ip_list):

    model_folder = "../ai-server/models"

    model_names = os.listdir(model_folder)
    models = []

    for m in model_names:
        model_path = os.path.join(model_folder, m)
        model = load_model(model_path)
        models.append(model)


    curr_dir = os.getcwd()
    os.chdir(curr_dir)
    inp_folder = "../whois"
    file_name = "getInspectorScores.js"


    x_train, y_train = [], []

    random.shuffle(ip_list)

    for ip in ip_list[:3]:
        inputs = get_inputs(inp_folder, file_name, ip).split()

        x = list(map(float, inputs))
        # print(x)
        try:
            y = int(get_score(ip))
        except:
            continue

        y = np.array(y)

        x_train.append(x)
        y_train.append(y)


    x_train, y_train = np.array(x_train), np.array(y_train)
    # print(x_train.shape, y_train.shape)

    for model in models:
        model.fit(x_train, y_train, batch_size=10, nb_epoch=30)

    print("Model Trained!")