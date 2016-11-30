from distutils.core import setup, Extension

module1 = Extension('biosig',
                    define_macros = [('MAJOR_VERSION', '1'),
                                     ('MINOR_VERSION', '8')],
                    include_dirs = ['/usr/local/include'],
                    libraries = ['biosig'],
                    library_dirs = ['/usr/local/lib'],
                    sources = ['biosigmodule.c'])

setup (name = 'Biosig',
       version = '1.8',
       description = 'This is a biosig package',
       author = 'Alois Schloegl',
       author_email = 'alois.schloegl@ist.ac.at',
       url = 'http://docs.python.org/extending/building',
       long_description = '''This is the biosig demo package.''',
       ext_modules = [module1])

