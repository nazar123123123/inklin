FROM python:3
COPY dumptokens.py /
COPY dumptokens.sh /
RUN git clone https://github.com/blockchain-etl/ethereum-etl.git
RUN pip install -r ethereum-etl/requirements.txt
CMD ["/bin/sh", "/dumptokens.sh"]