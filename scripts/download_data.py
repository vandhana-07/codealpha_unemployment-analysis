import os
import urllib.request

URL_1 = "https://raw.githubusercontent.com/Yash22222/Oasis-Infobyte-Data-Science-Internship/main/Unemployment%20in%20India.csv"
URL_2 = "https://raw.githubusercontent.com/Yash22222/Oasis-Infobyte-Data-Science-Internship/main/Unemployment_Rate_upto_11_2020.csv"

# Alternate mirror URLs in case the specified ones fail (e.g. 404)
ALT_URL_1 = "https://raw.githubusercontent.com/rishhh12/India-Unemployment-Data/main/Unemployment_in_India.csv"
ALT_URL_2 = "https://raw.githubusercontent.com/SaiyamTuteja/Unemployment-in-India/main/Unemployment_Rate_upto_11_2020.csv"

DATA_DIR = "data"
FILE_1 = os.path.join(DATA_DIR, "Unemployment_in_India.csv")
FILE_2 = os.path.join(DATA_DIR, "Unemployment_Rate_upto_11_2020.csv")

def download_file(url, dest, alt_url=None):
    print(f"Downloading {url} to {dest}...")
    try:
        urllib.request.urlretrieve(url, dest)
        print(f"Successfully downloaded {dest}")
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        if alt_url:
            print(f"Trying mirror URL: {alt_url}...")
            try:
                urllib.request.urlretrieve(alt_url, dest)
                print(f"Successfully downloaded {dest} from mirror")
                return True
            except Exception as alt_e:
                print(f"Error downloading from mirror {alt_url}: {alt_e}")
        return False

def main():
    os.makedirs(DATA_DIR, exist_ok=True)
    success1 = download_file(URL_1, FILE_1, ALT_URL_1)
    success2 = download_file(URL_2, FILE_2, ALT_URL_2)
    
    if not (success1 and success2):
        print("\nDownload failed. Please manually download the files from Kaggle and place them in the data/ directory.")
        exit(1)
    else:
        print("\nAll files downloaded successfully.")

if __name__ == "__main__":
    main()
