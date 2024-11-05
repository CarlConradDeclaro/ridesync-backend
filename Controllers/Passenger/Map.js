import fetch from 'node-fetch'


const Location = async (req, res) => {
    const { query } = req.query;
    const boundingBox = '5.0,116.0,20.0,127.0';
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&boundingbox=${boundingBox}`);

    const data = await response.json()
    res.json(data)
}


export { Location }