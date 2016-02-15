#!/usr/bin/python


import sys, getopt, time
import Image, ImageDraw
from rgbmatrix import Adafruit_RGBmatrix


def main(argv):
    # init led matrix
    matrix = Adafruit_RGBmatrix(32, 1)
    matrix.Clear()

    # file name
    inputfile = ''
    try:
        opts, args = getopt.getopt(argv, "hi:o:", ["ifile="])
    except getopt.GetoptError:
        print 'test.py -i <inputfile>'
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print 'test.py -i <inputfile>'
            sys.exit()
        elif opt in ("-i", "--ifile"):
            inputfile = arg

    # play
    print 'Input file is ', inputfile
    image = Image.open(inputfile)
    image.load()
    matrix.SetImage(image.im.id, 0, 1)
    time.sleep(10.0)
    matrix.Clear()


if __name__ == "__main__":
    main(sys.argv[1:])
