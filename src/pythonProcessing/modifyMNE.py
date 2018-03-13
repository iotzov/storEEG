from types import MethodType

raw.displayRaw = MethodType(displayRaw, raw)

# this attaches the method displayRaw to the object raw as a bound method
# this means that implicit references to 'self' as the 1st parameter work correctly
