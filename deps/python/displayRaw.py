import matplotlib.pyplot as plt

def displayRaw(self):
    """Display a scaled image of the Raw data using standard methods"""

    if not self.preload:
        self.load_data()

    print(self._data.shape)
    self._data = self._data[0:63,:]

    D, T = self._data.shape

    # plt.imshow(self._data[0:63,:], cmap=plt.cm.jet, extent=(0,T,0,D), origin='upper', aspect='auto')
    plt.imshow(self._data, cmap=plt.cm.jet, extent=(0,T,0,D), origin='lower', aspect='auto')
