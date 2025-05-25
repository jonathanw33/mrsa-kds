import logging
import sys

# Get logger with a single handler
logger = logging.getLogger("blast_info")
logger.setLevel(logging.INFO)

# Remove any existing handlers to avoid duplication
if logger.handlers:
    for handler in logger.handlers:
        logger.removeHandler(handler)

# Add just one handler
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

def info_log(message):
    """Log an info message to the console"""
    logger.info(message)
