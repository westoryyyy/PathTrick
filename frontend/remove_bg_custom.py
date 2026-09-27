import numpy as np
from PIL import Image

def remove_checkerboard(img_path, out_path):
    img = Image.open(img_path).convert("RGBA")
    data = np.array(img)
    
    h, w = data.shape[:2]
    
    # Let's sample the top-left 32x32 pixels to find the background colors
    sample = data[0:32, 0:32]
    
    # We want to find the two most common colors in the sample
    # Flatten the sample and count colors
    colors, counts = np.unique(sample.reshape(-1, 4), axis=0, return_counts=True)
    
    # Sort by frequency
    sorted_idx = np.argsort(-counts)
    
    # The top 2 colors should be the checkerboard colors
    bg_colors = colors[sorted_idx[:2]]
    print("Detected background colors:", bg_colors)
    
    # Now we create a mask of pixels that match either of these two colors (within a small tolerance)
    tolerance = 15
    mask = np.zeros((h, w), dtype=bool)
    
    for c in bg_colors:
        # Distance in RGB space
        dist = np.sum(np.abs(data[:, :, :3] - c[:3]), axis=-1)
        mask |= (dist < tolerance)
        
    # We don't want to remove these colors from the character!
    # So we do a flood fill starting from the edges.
    
    from collections import deque
    queue = deque()
    visited = np.zeros((h, w), dtype=bool)
    
    # Add borders as seeds
    for y in range(h):
        queue.append((y, 0))
        queue.append((y, w-1))
        visited[y, 0] = True
        visited[y, w-1] = True
        
    for x in range(w):
        queue.append((0, x))
        queue.append((h-1, x))
        visited[0, x] = True
        visited[h-1, x] = True
        
    # Flood fill
    to_remove = np.zeros((h, w), dtype=bool)
    
    while queue:
        y, x = queue.popleft()
        
        if mask[y, x]:
            to_remove[y, x] = True
            
            for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
                ny, nx = y+dy, x+dx
                if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                    visited[ny, nx] = True
                    queue.append((ny, nx))
                    
    # Anti-aliasing cleanup: also remove pixels that are very close to the removed ones 
    # if they are also close to bg color. But let's just apply to_remove first.
    data[to_remove, 3] = 0
    
    out = Image.fromarray(data)
    out.save(out_path)
    print("Saved", out_path)

remove_checkerboard("public/char_dreamer.jpg", "public/char_dreamer.png")
