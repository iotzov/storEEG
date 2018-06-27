Author: Ivan Iotzov

## Python installation instructions

Python installation is not necessary for the basic functioning of storEEG,
but it is necessary for some features such as viewing EEG recordings
and exporting segments of data.

### Linux Installation Instructions

1. install python: `sudo apt-get install python`

2. install pip(if it is not already installed): `sudo apt-get install python-pip`

3. install python dependencies: `pip install numpy scipy matplotlib mne`

4. make sure that python is accessible from the shell. if the `python` command
does not work, then storEEG python features will not work.

  - **note:** python2.x and python3.x are both supported, but storEEG will
  use whatever version is found under the default `python` command

### Windows Installation Instructions

1. Download and install python (anaconda versions are acceptable)
  - Latest release can be found [here](https://www.python.org/downloads/)
2. Ensure that the default `python` command is functional. This can be done
by adding the path to your python installation to your system PATH variable.
3. Install dependencies through pip or anaconda
  - Required dependencies: `numpy`, `scipy`, `matplotlib`, `mne`
  - Install thru pip: `python -m pip install numpy scipy matplotlib mne`
