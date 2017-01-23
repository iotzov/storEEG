import storEEG
import processEEG
import sys
import time

processor = processEEG.StorProcessor(sys.argv[1])

processor.readEvents()
print('\nEvents read successfully!')
time.sleep(2)

print('\nMoving to extract volume')
time.sleep(2)

processor.volumize()
