'use strict';

import logger from '../utils/logger.js';
import JsonStore from './json-store.js';

const playlistStore = {

  store: new JsonStore('./models/playlist-store.json', { playlistCollection: [] }),
  collection: 'playlistCollection',
  array: 'songs',

  getAllPlaylists() {
    return this.store.findAll(this.collection);
  },

  getPlaylist(id) {
    return this.store.findOneBy(this.collection, (playlist => playlist.id === id));
  },
  
  async addSong(id, song) {
    await this.store.addItem(this.collection, id, this.array, song);
  },

  async removeSong(id, songId) {
    await this.store.removeItem(this.collection, id, this.array, songId);
  },

  async addPlaylist(playlist) {
    await this.store.addCollection(this.collection, playlist);
  },


  deleteSong(request, response) {
      const playlistId = request.params.id;
      const songId = request.params.songid;
      logger.debug(`Deleting Song  $(songId} from Playlist ${playlistId}`);
      playlistStore.removeSong(playlistId, songId);
      response.redirect('/playlist/' + playlistId);
  },

  removePlaylist(id) {
    const playlist = this.getPlaylist(id);
    this.store.removeCollection(this.collection, playlist);
  },

  getUserPlaylists(userid) {
    return this.store.findBy(this.collection, (playlist => playlist.userid === userid));
  },

  searchUserPlaylists(search, userid) {
    return this.store.findBy(
      this.collection,
      (playlist => playlist.userid === userid && playlist.title.toLowerCase().includes(search.toLowerCase())))
  }, 

  searchPlaylist(search) {
    return this.store.findBy(
      this.collection,
      (playlist => playlist.title.toLowerCase().includes(search.toLowerCase())))
  }


};

export default playlistStore;
