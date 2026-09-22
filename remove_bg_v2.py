from PIL import Image

def remove_pink_bg(input_path, output_path):
    img = Image.open(input_path)
    frames = []
    
    try:
        while True:
            rgba = img.convert("RGBA")
            datas = rgba.getdata()
            
            bg_color = datas[0] 
            
            newData = []
            for item in datas:
                if abs(item[0] - bg_color[0]) < 5 and abs(item[1] - bg_color[1]) < 5 and abs(item[2] - bg_color[2]) < 5:
                    newData.append((255, 255, 255, 0)) 
                else:
                    newData.append(item)
            
            rgba.putdata(newData)
            frames.append(rgba)
            img.seek(img.tell() + 1)
    except EOFError:
        pass

    if frames:
        # Save RGBA frames as GIF. Pillow will automatically quantize and handle transparency
        frames[0].save(
            output_path,
            format='GIF',
            save_all=True,
            append_images=frames[1:],
            loop=img.info.get('loop', 0),
            duration=img.info.get('duration', 100),
            disposal=2
        )
        print(f"Saved to {output_path}")

if __name__ == '__main__':
    remove_pink_bg('public/Walking.gif', 'public/Walking_transparent_v2.gif')
