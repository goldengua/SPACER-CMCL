import pandas as pd
import eng_to_ipa as ipa
from Levenshtein import distance
from scipy.spatial.distance import cosine
import numpy as np
from minicons import scorer
import tqdm
from collections import defaultdict

# Warning: This will download a 550mb model file if you do not already have it!
model = scorer.IncrementalLMScorer('gpt2', 'cpu')


##convert English words to IPA
def converter(s):
    return ipa.convert(s, retrieve_all=False, stress_marks=False)

###Load GloVe Model
def load_glove_model():
    return {line.split()[0]: np.array(line.split()[1:], dtype='float32') for line in open("glove.6B.300d.txt", 'r', encoding='utf-8')}
embeddings = load_glove_model()

###calculate cosine distance between glove embeds
def semantic_distance(word1, word2, embeddings):
    if word1.lower() in embeddings and word2.lower() in embeddings:
        return cosine(embeddings[word1.lower()], embeddings[word2.lower()])
    return -1  # Return -1 if word not found

##load word frequency dictionary
def load_word_freq_dict():
    df1 = pd.read_excel('SUBTLEXusfrequencyabove1.xls')
    df1['lower'] = df1['Word'].str.lower()
    my_dict = df1.set_index('lower')['Lg10WF'].to_dict()
    return my_dict
wordfreq_dict = load_word_freq_dict()

###calculate word freq for a list of words
def word_freq(word):
    try:
        v = wordfreq_dict[word]
    except:
        v = 0   
    return v

####calculate gpt-2 log probability for a list of sentences
def cal_logprob(context,target):
	return model.conditional_score(context,target)