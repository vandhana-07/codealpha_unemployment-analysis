import json
import sys
import io
import contextlib
import base64
from pathlib import Path

# Load notebook
notebook_path = Path("analysis.ipynb")
with open(notebook_path, "r") as f:
    nb = json.load(f)

# Mock plt.show() so it doesn't open windows but we still capture figures
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

local_vars = {}
execution_count = 0

for cell in nb["cells"]:
    if cell["cell_type"] == "code":
        execution_count += 1
        cell["execution_count"] = execution_count
        
        # Clear previous outputs
        cell["outputs"] = []
        
        code = "".join(cell["source"])
        print(f"Executing Code Cell {execution_count}...")
        
        # Redirect stdout
        f_stdout = io.StringIO()
        exception = None
        
        with contextlib.redirect_stdout(f_stdout):
            try:
                # Use local_vars for both globals and locals to fix nested scope/lambda lookups in exec
                exec(code, local_vars)
            except Exception as e:
                import traceback
                exception = e
                tb_lines = traceback.format_exception(type(e), e, e.__traceback__)
                print("".join(tb_lines), file=sys.stderr)
        
        # Collect stdout stream output
        stdout_val = f_stdout.getvalue()
        if stdout_val:
            cell["outputs"].append({
                "name": "stdout",
                "output_type": "stream",
                "text": [line + "\n" for line in stdout_val.splitlines()]
            })
            
        # Collect error output if exception occurred
        if exception:
            print(f"Error in cell {execution_count}: {exception}")
            cell["outputs"].append({
                "ename": type(exception).__name__,
                "evalue": str(exception),
                "output_type": "error",
                "traceback": tb_lines
            })
            
        # Collect matplotlib plot outputs
        fig_nums = plt.get_fignums()
        if fig_nums:
            for num in fig_nums:
                fig = plt.figure(num)
                buf = io.BytesIO()
                fig.savefig(buf, format="png", dpi=150, bbox_inches="tight")
                buf.seek(0)
                img_b64 = base64.b64encode(buf.read()).decode("utf-8")
                
                cell["outputs"].append({
                    "data": {
                        "image/png": img_b64,
                        "text/plain": [f"<Figure size {fig.get_size_inches()[0]*fig.dpi}x{fig.get_size_inches()[1]*fig.dpi} with {len(fig.axes)} Axes>"]
                    },
                    "metadata": {},
                    "output_type": "display_data"
                })
            plt.close("all")

# Write executed notebook back
with open(notebook_path, "w") as f:
    json.dump(nb, f, indent=2)

print("\nNotebook analysis.ipynb executed and saved with outputs successfully!")
