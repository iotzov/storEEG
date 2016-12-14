import remi.gui as gui
from remi import start, App

class Repository(App):
    def __init__(self, *args):
        super(Repository, self).__init__(*args)

    def main(self):
        mainMenu_container = gui.VBox(width = 240, height = 200)

        # Button to add new data
        self.addNewButton = gui.Button('Add New Data')
        self.addNewButton.set_on_click_listener(self.addNewClicked)
        mainMenu_container.append(self.addNewButton)

        # Button to browse data
        self.browseButton = gui.Button('Browse Data')
        self.browseButton.set_on_click_listener(self.browseClicked)
        mainMenu_container.append(self.browseButton)

        # Button for help menu
        self.helpButton = gui.Button('Help')
        self.helpButton.set_on_click_listener(self.helpClicked)
        mainMenu_container.append(self.helpButton)

        # Button to exit
        self.exitButton = gui.Button('Exit')
        self.exitButton.set_on_click_listener(self.exitClicked)
        mainMenu_container.append(self.exitButton)


        return mainMenu_container

    def addNewClicked(self, widget):
        pass

    def browseClicked(self, widget):
        pass

    def helpClicked(self, widget):
        pass

    def exitClicked(self, widget):
        pass

if __name__ == '__main__':
    start(Repository)
