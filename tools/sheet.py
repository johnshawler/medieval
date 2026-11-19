import sys
from PIL import Image
out, cols, *fs = sys.argv[1:]
cols = int(cols); ims = [Image.open(f).resize((960, 540)) for f in fs]
rows = (len(ims) + cols - 1) // cols
sh = Image.new('RGB', (cols * 960, rows * 540), 'white')
for i, im in enumerate(ims): sh.paste(im, ((i % cols) * 960, (i // cols) * 540))
sh.save(out, quality=88)
