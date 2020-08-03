import keras
from keras.models import Sequential
from keras.layers import Dense
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
import pickle, os
import numpy as np


def save_model(filename, model):
    pickle.dump(model, open(filename, 'wb'))

def load_model(filename):
    return pickle.load(open(filename, 'rb'))


classifier = Sequential()
classifier.add(Dense(output_dim=8, init='uniform', activation='relu', input_dim=6))
classifier.add(Dense(output_dim=6, init='uniform', activation='relu'))
classifier.add(Dense(output_dim=1, init='uniform', activation='sigmoid'))
classifier.compile(optimizer='adam', loss='mean_squared_error', metrics=['accuracy'])

df = pd.read_excel("Dataset.xlsx", sheet_name="Sheet4")

x = df.iloc[:, 3:-1].values
y = df.iloc[:, -1].values

# print(y)
# y = [list(map(lambda x: x / 100, list(df.iloc[:, -1])))]
x = np.array(x)
y = np.array(list(map(lambda x: [float(x / 100)], y)))

print(x.shape, y.shape)
scaler = MinMaxScaler()

scaler.fit(x)
x = scaler.transform(x)

scaler.fit(y)
y = scaler.transform(y)


x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=1/5, random_state=0)

classifier.fit(x_train, y_train, batch_size=10, nb_epoch=100)

y_predict = classifier.predict(x_test)
diff = []

for i in range(len(y_predict)):
    data = "{} {}".format(y_predict[i][0] * 100, y_test[i][0] * 100)
    diff.append(abs(y_predict[i][0] - y_test[i][0]))
    print(data)

print(classifier.evaluate(x_test, y_test))

accuracy = sum(diff) / len(diff)
print(accuracy)

folder = "models"
file = os.path.join(folder, "ann_model11.pickle")

save_model(file, classifier)