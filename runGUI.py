import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk

class gadroRep:

    def OpenBrowseDataWindow(self, button):
        self.BrowseDataSets.show_all()
        self.BrowseDataSets.hide()

    def onDeleteWindow(self, *args):
        Gtk.main_quit(*args)

    def HelpButtonPressed(self, button):
        self.HelpScreen.show_all()

    def QuitButtonPressed(self, button):
        Gtk.main_quit()

    def __init__(self):
        self.builder = Gtk.Builder()
        self.builder.add_from_file('avogadroGUI.glade')

        self.builder.connect_signals(self)

        self.MainMenu = self.builder.get_object('MainMenu')
        self.BrowseDataSets = self.builder.get_object('BrowseDataSets')
        self.HelpScreen = self.builder.get_object('HelpScreen')
        self.MainMenu.show_all()

if __name__ == "__main__":
    main = gadroRep()
    Gtk.main()

