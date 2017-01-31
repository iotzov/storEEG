import os
import sqlite3 as sql

class storDB(object):

    def __init__(self):
        self.dbPath = os.path.join(os.getcwd(), os.pardir, 'storDB')
        if not os.path.exists(self.dbPath):
            self.firstStartup()
        else:
            os.chdir(self.dbPath)
            self.db = sql.connect('stor.DB')
            self.c = self.db.cursor()

    def firstStartup(self):
        os.mkdir(self.dbPath)
        os.chdir(self.dbPath)
        self.db = sql.connect('stor.DB')
        self.c = self.db.cursor()
        with open('settings.conf', 'w') as f:
            f.write('DB path:\n\n' + self.dbPath)
