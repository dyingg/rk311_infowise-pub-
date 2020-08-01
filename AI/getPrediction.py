import ipaddress
import pickle, os, sys, logging
import numpy as np
# import keras, tensorflow
logging.disable(logging.WARNING)
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"



def load_model(filename):
    return pickle.load(open(filename, 'rb'))

def get_prediction(model, org_score, asn_score, tor_score, blacklist_score, rDNS_score, keyword_score):
    data = [org_score, asn_score, tor_score, blacklist_score, rDNS_score, keyword_score]
    data = np.array([data])    

    prediction = list(model.predict(data))
    # print(prediction[0][0])
    return prediction[0][0]

try:
        
    # curr_dir = os.getcwd()
    # file_dir = os.path.dirname(os.path.realpath(__file__))
    # # print(curr_dir, file_dir)
    # os.chdir(file_dir)
    
    model_names = os.listdir("models")
    
    folder = "models"
    org_score = sys.argv[1]
    asn_score = sys.argv[2]
    tor_score = sys.argv[3]
    blacklist_score = sys.argv[4]
    rDNS_score = sys.argv[5]
    keyword_score = sys.argv[6]
    

    for m in model_names:
        model_path = os.path.join(folder, m)
        model = load_model(model_path)
       

        pred = get_prediction(model, org_score, asn_score, tor_score, blacklist_score, rDNS_score, keyword_score)
        s = str(pred)

        print(s, end=" ")

except Exception as e:
    print(e)
    
    
# os.chdir(curr_dir)
