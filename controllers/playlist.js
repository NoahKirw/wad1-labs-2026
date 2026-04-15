'use strict';

import logger from '../utils/logger.js';
import playlistStore from '../models/playlist-store.js';
import { v4 as uuidv4 } from 'uuid';
import accounts from './accounts.js';



const playlist = {
  createView(request, response) {
    const playlistId = request.params.id;
    const loggedInUser = accounts.getCurrentUser(request);
    logger.debug('Playlist id = ' + playlistId);
    
    const viewData = {
      title: 'Playlist',
      singlePlaylist: playlistStore.getPlaylist(playlistId),
      fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
    };

    response.render('playlist', viewData);
},


  async addSong(request, response) {
    const playlistId = request.params.id;
    const newSong = {
      id: uuidv4(),
      title: request.body.title,
      artist: request.body.artist,
    };
    await playlistStore.addSong(playlistId, newSong);
    response.redirect('/playlist/' + playlistId);
  },

  async deleteSong(request, response) {
    const playlistId = request.params.id;
    const songId = request.params.songid;
    logger.debug(`Deleting Song  $(songId} from Playlist ${playlistId}`);
    await playlistStore.removeSong(playlistId, songId);
    response.redirect('/playlist/' + playlistId);
  },


};

export default playlist;
