author: Ivan Iotzov

date: Oct. 23, 2017

These install instructions are temporary and will eventually be replaced by a
standalone .exe style installer.

## Linux instructions for installing base app


1. Pull repo from github: `git clone https://github.com/iotzov/storEEG`

2. install Node.js: `sudo apt-get install nodejs-legacy`

3. install npm: `sudo apt-get install npm`

3. move to app directory: `cd ./storEEG/`

4. install app dependencies: `npm install`

5. start app: `npm start`

### optional, but necessary for plotting/exporting functionality

a. install python3: `sudo apt-get install python3`

b. install pip: `sudo apt-get install python3-pip`

b. install python3 dependencies: `pip3 install numpy scipy matplotlib mne`
