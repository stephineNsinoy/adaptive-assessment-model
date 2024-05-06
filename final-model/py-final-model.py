import tensorflow as tf
import json

# Map string labels to integers
labelList = ['B', 'E', 'M', 'H', 'V']
labelMap = {label: idx for idx, label in enumerate(labelList)}

def load_model_and_predict():
    # Load the model
    model = tf.keras.models.load_model('./py-suggest-next-difficulty-model')

    # Feature scaling parameters
    with open('./py-suggest-next-difficulty-model/scalingParameters.json', 'r') as f:
        scalingParameters = json.load(f)
    featureMaxs = tf.convert_to_tensor(scalingParameters['featureMaxs'], dtype=tf.float32)
    featureMins = tf.convert_to_tensor(scalingParameters['featureMins'], dtype=tf.float32)

    # Predict
    while True:
        data = input("Enter your test input (Difficulty, Time Spent, Number of Executions, Is Perfect): ")
        inputs = [float(num) if num not in labelMap else labelMap[num] for num in data.split(',')]
        inputTensor = tf.convert_to_tensor([inputs], dtype=tf.float32)
        
        # Scale the input
        scaledInputTensor = (inputTensor - featureMins) / (featureMaxs - featureMins)
        prediction = tf.argmax(model.predict(scaledInputTensor), axis=1)
        print('Predicted Next Difficulty: ', labelList[prediction.numpy()[0]])

load_model_and_predict()
