const router = require('express').Router();
const Link = require('../models/Link');

router.get('/', async (req, res) => {
    try {
        const links = await Link.find();

        res.status(200).json(links);
    } catch (error) {
        res.status(500).json({error: error})
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id

    try {
        const link = await Link.findOne({_id: id});

        if(!link) {
            res.status(422).json({ message: 'Link não encontrado' });
            return;
        }

        res.status(200).json(link);
    } catch (error) {
        res.status(500).json({error: error});
    }
});

router.post('/', async (req, res) => {

    const { name, url } = req.body;

    if(!name) {
        res.status(422).json({error: 'O título do link é obrigatório'});
        return;
    }

    if(!url) {
        res.status(422).json({error: 'A url do link é obrigatória'});
        return;
    }

    const link = {
        name,
        url 
    };

    try {
        await Link.create(link);

        res.status(201).json({message: 'Link inserido com sucesso!'});
    } catch (error) {
        res.status(500).json({error: error})
    }

});

router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const { name, url } = req.body;
    const link = {
        name,
        url 
    };

    try {
        const updatedLink = await Link.updateOne({_id: id}, link);

        if(updatedLink.matchedCount === 0) {
            res.status(422).json({ message: 'Link não encontrado' });
            return;
        }

        res.status(200).json(link);
    } catch (error) {
        res.status(500).json({error: error});
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const link = await Link.findOne({_id: id});

    if(!link) {
        res.status(422).json({ message: 'Link não encontrado' });
        return;
    }

    try {
        await Link.deleteOne({_id: id});
        res.status(200).json({ message: 'Link removido com sucesso' })
    } catch (error) {
        res.status(500).json({error: error}); 
    }
});

module.exports = router;