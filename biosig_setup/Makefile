####### Makefile for "BioSig for C/C++" #####################
###
###  Copyright (C) 2006,2007,2008,2009,2012,2016 Alois Schloegl <alois.schloegl@ist.ac.at>
###  This file is part of the "BioSig for C/C++" repository 
###  (biosig4c++) at http://biosig.sf.net/ 
###
##############################################################

PYTHON ?= python
PYVER  := $(shell $(PYTHON) -c "import sys; print(sys.version[:3])")


# old style, using swig interface
biosig4python:
	make -C .. biosig4python


# new interface, using so-called "extension modules", this still experimental
module:
	$(PYTHON) setup.py build

install: module
	$(PYTHON) setup.py install

test:
	## get ../data/Newtest17-256.bdf
	make -C .. fetchdata
	## need to run from different directory, because
	(cd .. && PYTHONPATH=/usr/local/lib/python$(PYVER)/dist-packages/ $(PYTHON) -c 'import biosig; print biosig.header("data/Newtest17-256.bdf")')
	(cd .. && PYTHONPATH=/usr/local/lib/python$(PYVER)/dist-packages/ $(PYTHON) -c 'import biosig; print biosig.data("data/Newtest17-256.bdf")')
	(cd .. && PYTHONPATH=/usr/local/lib/python$(PYVER)/dist-packages/ python$(PYVER) < python/demo2.py)


