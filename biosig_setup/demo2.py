####### Demo for Python interface to BioSig" #####################
###
###  Copyright (C) 2009,2016 Alois Schloegl <alois.schloegl@ist.ac.at>
###  This file is part of the "BioSig for Python" repository
###  at http://biosig.sf.net/
###
##############################################################

# download and extract 
#   http://www.biosemi.com/download/BDFtestfiles.zip 
# into /tmp/
# then run this demo 
#
# on linux you can run instead  
#   make test 

import biosig
import numpy as np
import matplotlib.pyplot as plt
import json

## read header 
HDR=biosig.header("data/Newtest17-256.bdf")
#print HDR
## extracting header fields
H=json.loads(HDR)
H['CHANNEL'][1]['Filter']

## read and display data
A=biosig.data("data/Newtest17-256.bdf")
NS=np.size(A,1)

fig = plt.figure()
ax  = fig.add_subplot(111)
h   = plt.plot(np.arange(np.size(A,0))/H['Samplingrate'],A[:,3:7]);
ax.set_xlabel('time [s]')
plt.show()


