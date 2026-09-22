from PIL import Image

def remove_bg(input_path, output_path):
    img = Image.open(input_path)
    frames = []
    
    # Assuming top-left pixel is the background color
    bg_color = img.getpixel((0, 0))
    print(f"Detected background color index: {bg_color}")
    
    try:
        while True:
            frame = img.copy()
            frames.append(frame)
            img.seek(img.tell() + 1)
    except EOFError:
        pass

    if frames:
        # Save as animated GIF with transparency
        frames[0].save(
            output_path,
            format='GIF',
            save_all=True,
            append_images=frames[1:],
            loop=img.info.get('loop', 0),
            duration=img.info.get('duration', 100),
            transparency=bg_color,
            disposal=2
        )
        print(f"Saved to {output_path}")

if __name__ == "__main__":
    remove_bg('public/Walking.gif', 'public/Walking_transparent.gif')
