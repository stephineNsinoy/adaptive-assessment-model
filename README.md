# Adaptive Assessment Model for Programming Problems

## Dataset Preparation

Data was collected by randomly selecting participants who were users of CodeChum. The dataset includes information such as time taken, number of submissions, and correctness for 10,000 programming problems, categorized by difficulty levels. Each problem is classified by difficulty level (B for Beginner, E for Easy, M for Medium, H for Hard, V for Very Hard), alongside time spent in seconds, number of executions, and a binary indicator for perfection (1 for perfect, 0 for imperfect).

#### Example data from 10,000 programming problems answered by CodeChum users

| Problem Difficulty | Time Spent (seconds) | Number of Executions | Is Perfect (1/0) |
| ------------------ | -------------------- | -------------------- | ---------------- |
| B                  | 477                  | 3                    | 0                |
| E                  | 78                   | 1                    | 1                |
| M                  | 1200                 | 9                    | 0                |
| H                  | 1800                 | 12                   | 1                |
| V                  | 2400                 | 15                   | 0                |

## Calculating Next Difficulty

Thresholds for difficulty adjustment are defined based on the problem's initial difficulty level B (Beginner), E (Easy), M (Medium), H (Hard), and V (Very Hard).

#### Threshold definitions for difficulty adjustment

| Problem Difficulty | Time Spent Threshold (seconds) | Time Spent Threshold (minutes) | Executions Threshold |
| ------------------ | ------------------------------ | ------------------------------ | -------------------- |
| B                  | 300                            | 5                              | 3                    |
| E                  | 600                            | 10                             | 6                    |
| M                  | 1200                           | 20                             | 9                    |
| H                  | 1800                           | 30                             | 12                   |
| V                  | 2400                           | 40                             | 15                   |

The program adjusts difficulty based on predefined thresholds:

- Exceeding time spent or number of executions thresholds results in a -0.25 adjustment.
- A perfect submission yields a +0.25 adjustment.

### Mapping New Difficulty Value:

The definitions for mapping new difficulty values are based on five categories. The 'B' (Beginner) level covers a range from 0 to 0.24. The 'E' (Easy) level is defined from 0.25 to 0.49. For a medium level of difficulty, labeled 'M', the range is 0.5 to 0.74. The 'H' (Hard) category spans from 0.74 to 0.99. Finally, the 'V' (Very Hard) category is assigned a value of exactly 1.

#### Definitions for mapping a new difficulty value

| Problem Difficulty | Minimum | Maximum |
| ------------------ | ------- | ------- |
| B                  | 0       | 0.24    |
| E                  | 0.25    | 0.49    |
| M                  | 0.50    | 0.74    |
| H                  | 0.74    | 0.99    |
| V                  | 1.00    | 1.00    |

#### Example Data with the Addition of the 'Next Difficulty' derived from 10,000 programming problems answered by CodeChum users

| Problem Difficulty | Time Spent (seconds) | Number of Executions | Is Perfect (1/0) | Next Difficulty |
| ------------------ | -------------------- | -------------------- | ---------------- | --------------- |
| B                  | 477                  | 3                    | 0                | B               |
| E                  | 78                   | 1                    | 1                | M               |
| M                  | 1200                 | 9                    | 0                | H               |
| H                  | 1800                 | 12                   | 1                | V               |
| V                  | 2400                 | 15                   | 0                | V               |

## Multilayer Perceptron (MLP)

Dynamically adjusts problem difficulty based on student performance. All students start with the same difficulty problem, but as they engage, the MLP processes performance metrics like current difficulty, time spent, number of executions and correctness.

### Training the Multilayer Perceptron (MLP) Machine Learning Algorithm

#### Input Layers

Each neuron represents one feature of the input data.

- Difficulty (Numeric or Categorical, mapped to a number)
- Time Spent (Numeric)
- Number of Executions (Numeric)
- Is Perfect (Binary/Numeric)

#### Hidden Layers

The activation function used is ReLU (Rectified Linear Unit). It is responsible for learning the nonlinear patterns in the input data by applying weights and biases learned during training.

- Neuron 1
- Neuron 2
- ...
- Neuron 32

#### Output Layers

The activation function used here is Softmax, which converts the output into probability distributions (i.e., the output values are in the range (0, 1) and their sum is 1).

- Neuron B (Beginner)
- Neuron E (Easy)
- Neuron M (Medium)
- Neuron H (Hard)
- Neuron V (Very Hard)

#### Accuracy

With an accuracy of approximately 97%, the Multilayer Perceptron (MLP) Machine Learning Algorithm is instrumental in adaptive assessments. It precisely analyzes student performance data, dynamically adjusting the difficulty of programming problems. This accuracy ensures optimal challenge levels, contributing to a personalized and effective learning experience.
