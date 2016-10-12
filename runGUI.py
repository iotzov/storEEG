import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk

#class displaySetPage(
class gadroRep:

    def BrowseDataButtonClicked(self, button):
        self.BrowseDataSets = self.builder.get_object('BrowseDataSets')
        self.BrowseDataSets.show_all()

    def onDeleteMain(self, *args):
        Gtk.main_quit(*args)

    def onDeleteWindow(self, *args):
        args[0].hide()
        return True

    # Below needs to be fleshed out
    def SearchButtonClicked(self, button):
        pass 

    def HelpButtonClicked(self, button):
        self.HelpScreen = self.builder.get_object('HelpScreen')
        self.HelpScreen.show()

    def QuitButtonClicked(self, button):
        Gtk.main_quit()

    def AddNewButtonClicked(self, button):
        self.AddOrModifyDataSet = self.builder.get_object('AddOrModifyDataSet')
        self.AddOrModifyDataSet.show_all()

    def testGetChildren(self, button):
        for x in button.get_parent().get_children():
            print(Gtk.Buildable.get_name(x))

    def __init__(self):
        self.builder = Gtk.Builder()
        self.builder.add_from_file('avogadroGUI.glade')

        self.builder.connect_signals(self)

        self.MainMenu = self.builder.get_object('MainMenu')
        self.MainMenu.show_all()

if __name__ == "__main__":
    main = gadroRep()
    Gtk.main()

