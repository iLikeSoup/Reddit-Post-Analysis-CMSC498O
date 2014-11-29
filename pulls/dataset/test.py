#!/usr/bin/env python

import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

data = pd.read_csv(sys.argv[1])
print(data.head(3))