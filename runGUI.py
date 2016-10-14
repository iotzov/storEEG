import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk
from dataSet import *

#class displaySetPage(
class gadroRep:

    def BrowseDataButtonClicked(self, button):
        self.currentBrowsePage = self.createBrowsePage()
        self.currentBrowsePage.show_all()

    def onDeleteMain(self, *args):
        Gtk.main_quit(*args)

    def onDeleteWindow(self, *args):
        args[0].hide()
        return True

    # Function below needs to be fleshed out
    def SearchButtonClicked(self, button):
        pass

    def AddStimFiles(self, button):
        self.stimFileChooser.show_all()

    def AddStimTriggers(self, button):
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

    def destroyBrowse(self, *args):
        if(self.currentBrowsePage != None):
            self.currentBrowsePage.destroy()
            self.currentBrowsePage = None
            return True
        return False

    def __init__(self):
        self.builder = Gtk.Builder()
        self.builder.add_from_file('avogadroGUI.glade')

        self.builder.connect_signals(self)

        self.MainMenu = self.builder.get_object('MainMenu')
        self.MainMenu.show_all()
        self.stimFileChooser = self.builder.get_object('stimFileChooser')
        self.db = dataDB()

    def createBrowsePage(self):
        browseWindow = Gtk.Window()
        nbook = Gtk.Notebook()
        browseWindow.add(nbook)
        browseWindow.resize(400,400)
        nbook.set_tab_pos(Gtk.PositionType(0))
        for dset in self.db.sets:
            temp = Gtk.Grid()
            temp.set_row_spacing(4)
            temp.insert_column(0)
            temp.insert_column(1)
            temp.insert_row(0)
            temp.insert_row(1)
            temp.insert_row(2)
            temp.insert_row(3)
            temp.insert_row(4)

            nbook.append_page(temp, Gtk.Label(dset.name))
            temp.attach(Gtk.Label('Date: '), 0,0,1,1)
            temp.attach(Gtk.Label('Publications: '), 0,1,1,1)
            temp.attach(Gtk.Label('Experimenter: '), 0,2,1,1)
            temp.attach(Gtk.Label('Stimuli: '), 0,3,1,1)

            temp.attach(Gtk.Label(dset.date), 1,0,1,1)
            temp.attach(Gtk.Label(dset.publications), 1,1,1,1)
            temp.attach(Gtk.Label(dset.experimenter), 1,2,1,1)
            temp.attach(Gtk.Label(dset.stimuli), 1,3,1,1)

            a = Gtk.Button('View data set files and locations')
        browseWindow.connect('delete-event', self.destroyBrowse)
        return browseWindow


    def showFiles(self):
        pass

if __name__ == "__main__":
    main = gadroRep()
    Gtk.main()
