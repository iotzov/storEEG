#include <python2.7/Python.h>
#include <numpy/arrayobject.h>
#define array_data(a)          (((PyArrayObject *)a)->data)

#include <biosig-dev.h>

#define BIOSIG_MODULE
#include "biosigmodule.h"


static PyObject *BiosigError;

static int PyBiosig_Header(const char *filename, char **jsonstr) {
	// open file 
	HDRTYPE *hdr = NULL;
	hdr = sopen(filename, "r", hdr);

	if (serror2(hdr)) {
	        PyErr_SetString(BiosigError, "could not open file");
		destructHDR(hdr);
	        return -1;
	}

	// convert to json-string
	char *str = NULL;
	asprintf_hdr2json(&str, hdr);

	destructHDR(hdr);

	*jsonstr = strdup(str);
	return 0;
}

static PyObject *biosig_json_header(PyObject *self, PyObject *args) {
	// get input arguments 

	const char *filename = NULL;
	char *str = NULL;

	if (!PyArg_ParseTuple(args, "s", &filename)) return NULL;

	if (PyBiosig_Header(filename, &str)) return NULL;

	return Py_BuildValue("s", str);
}

static int PyBiosig_Data(const char *filename, PyObject **D) {
	// open file
	HDRTYPE *hdr = sopen(filename, "r", NULL);

	if (serror2(hdr)) {
	        PyErr_SetString(BiosigError, "could not open file");
		destructHDR(hdr);
	        return -1;
	}

	const int nd=2;
	npy_intp dims[nd];
	dims[0] = (int)(hdr->NRec*hdr->SPR);
	dims[1] = (int)(NumberOfChannels(hdr));
	int type_num;

	switch (sizeof(biosig_data_type)) {
	case 4:
		type_num=NPY_FLOAT32;
		break;
	case 8:
		type_num=NPY_FLOAT64;
		break;
	case 16:
		type_num=NPY_FLOAT128;
		break;
	}

        *D = PyArray_SimpleNew(nd, dims, type_num);
	hdr->FLAG.ROW_BASED_CHANNELS = 1;

	/*
	*D = PyArray_New(&PyArray_Type, nd, dims, type_num, NULL, NULL, 0, NPY_ARRAY_CARRAY, NULL);
	hdr->FLAG.ROW_BASED_CHANNELS = 0;
	*/
	size_t count = sread((double*)(((PyArrayObject *)(*D))->data), 0, hdr->NRec, hdr);

	hdr->data.block = NULL;
	destructHDR(hdr);

	return 0;
}

static PyObject *biosig_data(PyObject *self, PyObject *args) {
	// get input arguments
	const char *filename = NULL;

	if (!PyArg_ParseTuple(args, "s", &filename)) return NULL;

	PyObject* Data;

	if (PyBiosig_Data(filename, &Data)) return NULL;

	return Data;
}



static PyMethodDef BiosigMethods[] = {
    {"header",  biosig_json_header, METH_VARARGS, "load biosig header and export as JSON ."},
    {"data",    biosig_data,        METH_VARARGS, "load biosig data."},
/*
    {"base64",  biosig_json_header, METH_VARARGS, "load biosig header and export as JSON ."},
    {"fhir_json_binary_template",  biosig_json_header, METH_VARARGS, "load biosig header and export as JSON ."},
    {"fhir_xml_binary_template",  biosig_json_header, METH_VARARGS, "load biosig header and export as JSON ."},
*/
    {NULL, NULL, 0, NULL}        /* Sentinel */
};


PyMODINIT_FUNC initbiosig(void) {
    import_array();

    PyObject *m = Py_InitModule("biosig", BiosigMethods);
    if (m == NULL) return;

    BiosigError = PyErr_NewException("biosig.error", NULL, NULL);
    Py_INCREF(BiosigError);
    PyModule_AddObject(m, "error", BiosigError);

     /* additional initialization can happen here */
}


