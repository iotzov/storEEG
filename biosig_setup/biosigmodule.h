#ifndef Py_BIOSIGMODULE_H
#define Py_BIOSIGMODULE_H
#ifdef __cplusplus
extern "C" {
#endif

/* Header file for BIOSIGMODULE */

/* C API functions */
#define PyBiosig_Header_NUM 0
#define PyBiosig_Header_RETURN int
#define PyBiosig_Header_PROTO (const char *filename, char **jsonstr)

#define PyBiosig_Data_NUM 1
#define PyBiosig_Data_RETURN int
#define PyBiosig_Data_PROTO (const char *filename, PyObject **data)

/* Total number of C API pointers */
#define PyBiosig_API_pointers 2


#ifdef BIOSIG_MODULE
/* This section is used when compiling BIOSIGMODULE.c */

static PyBiosig_Header_RETURN PyBiosig_Header PyBiosig_Header_PROTO;
static PyBiosig_Data_RETURN   PyBiosig_Data   PyBiosig_Data_PROTO;

#else
/* This section is used in modules that use BIOSIGMODULE's API */

static void **PyBiosig_API;

#define PyBiosig_Header (*(PyBiosig_Header_RETURN (*)PyBiosig_Header_PROTO) PyBiosig_API[PyBiosig_Header_NUM])
#define PyBiosig_Data   (*(PyBiosig_Data_RETURN   (*)PyBiosig_Data_PROTO)   PyBiosig_API[PyBiosig_Data_NUM])

/* Return -1 on error, 0 on success.
 * PyCapsule_Import will set an exception if there's an error.
 */
static int
import_biosig(void) {
    PyBiosig_API = (void **)PyCapsule_Import("biosig._C_API", 0);
    return (PyBiosig_API != NULL) ? 0 : -1;
}

#endif

#ifdef __cplusplus
}
#endif

#endif /* !defined(Py_BIOSIGMODULE_H) */ 
