import cv2
import numpy as np
import os
'''
myimg = cv2.imread('/Users/abhinavsenthil/Desktop/Milk_Project/Testing/13-Nov-0633.jpg')
avg_color_per_row = np.average(myimg, axis=0)
avg_color = np.average(avg_color_per_row, axis=0)
# keep in mind that opencv uses BGR, not RGB!
'''

'''
    For the given path, get the List of all files in the directory tree 
'''


def getListOfFiles(dirName):
    # create a list of file and sub directories
    # names in the given directory
    listOfFile = os.listdir(dirName)
    allFiles = list()
    # Iterate over all the entries
    for entry in listOfFile:
        # Create full path
        fullPath = os.path.join(dirName, entry)
        # If entry is a directory then get the list of files in this directory
        if os.path.isdir(fullPath):
            allFiles = allFiles + getListOfFiles(fullPath)
        else:
            allFiles.append(fullPath)

    return allFiles


def main():
    dirName = '/Users/abhinavsenthil/Desktop/Milk_Project'

    # Get the list of all files in directory tree at given path
    listOfFiles = getListOfFiles(dirName)



    # Get the list of all files in directory tree at given path
    listOfFiles = list()
    for (dirpath, dirnames, filenames) in os.walk(dirName):
        listOfFiles += [os.path.join(dirpath, file) for file in filenames]

    # Print the files
    for elem in listOfFiles:

        if elem.endswith('.jpg'):
            myimg = cv2.imread(elem)
            avg_color_per_row = np.average(myimg, axis=0)
            avg_color = np.average(avg_color_per_row, axis=0)
            multi_array = [avg_color[0], avg_color[1], avg_color[2]]
            print(multi_array[2])

            # keep in mind that opencv uses BGR, not RGB!



        else:
            pass




if __name__ == '__main__':
    main()



