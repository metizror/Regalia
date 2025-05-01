window.addEventListener("DOMContentLoaded", () => {
  if (!customElements.get("video-hero")) {
    class videoHero extends HTMLElement {
      constructor() {
        super();
        this.video = this.querySelector(".custom-video");
        this.YoutubeVideo = this.querySelector(".youtube-video-player");
        this.VimeoVideo = this.querySelector(".vimeo-video-player");
        this.circlePlayButton = this.querySelector(".custom-video-btn");

        // init functions
        if (this.video) {
          this.togglePlay();
        }
        if (this.YoutubeVideo) {
          this.YTVideo();
        }
        if (this.VimeoVideo) {
          this.vimeoVideos();
        }
      }

      // HTML5 video toggle
      togglePlay = () => {
        let circlePlaying = this.querySelector(".thumbnail-wrapper-id"),
          SecondplayBtn = this.querySelector(".second_play-btn"),
          video = this.querySelector(".custom-video"),
          videoAutoplay = video.dataset.autoplay,
          videomuted = video.getAttribute("muted");
        if (videoAutoplay == "true" && videomuted == "muted") {
          SecondplayBtn.style.opacity = "0";
          SecondplayBtn.classList.add("show_btn");
        } else {
          this.circlePlayButton.addEventListener("click", () => {
            if (video.paused || video.ended) {
              video.play();
              circlePlaying.style.display = "none";
              SecondplayBtn.style.opacity = "0";
              SecondplayBtn.classList.add("show_btn");
            }
          });
        }
        SecondplayBtn.addEventListener("click", function () {
          if (video.paused || video.ended) {
            video.play();
            SecondplayBtn.style.opacity = "0";
          } else {
            video.pause();
            SecondplayBtn.style.opacity = "1";
          }
        });
      };

      YTVideo = () => {
        let player = null,
          getYoutubeId = this.YoutubeVideo.dataset.youtubeid,
          youtubeAutoplay = this.YoutubeVideo.dataset.youtubeautoplay,
          youtubeMuted = this.YoutubeVideo.dataset.youtubemuted,
          circlePlaying = this.querySelector(".thumbnail-wrapper-id"),
          SecondplayBtn = this.querySelector(".second_play-btn");

        const handleVideoPlayer = () => {
          youtubeMuted == "1" ? player.mute() : player.unMute();
          if (youtubeAutoplay == "1" && youtubeMuted == "1") {
            player.playVideo();
            SecondplayBtn.style.opacity = "0";
            SecondplayBtn.classList.add("show_btn");
          } else {
            this.circlePlayButton.addEventListener("click", function () {
              if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
                player.playVideo();
                youtubeMuted == "1" ? player.mute() : player.unMute();

                circlePlaying.style.display = "none";
                SecondplayBtn.style.opacity = "0";
                SecondplayBtn.classList.add("show_btn");
              }
            });
          }

          SecondplayBtn.addEventListener("click", function () {
            if (player.getPlayerState() === YT.PlayerState.PLAYING) {
              player.pauseVideo();
              SecondplayBtn.style.opacity = "1";
            } else {
              player.playVideo();
              SecondplayBtn.style.opacity = "0";
            }
          });
        };
        const onPlayerStateChange = (event) => {
          var videoStatuses = Object.entries(window.YT.PlayerState);
          console.log(
            videoStatuses.find((status) => status[1] === event.data)[0]
          );
        };

        window.YT.ready(function () {
          player = new YT.Player("player", {
            videoId: getYoutubeId,
            playerVars: {
              controls: 0,
              showinfo: 0,
              rel: 0,
              enablejsapi: 1,
            },
            events: {
              onReady: handleVideoPlayer,
              onStateChane: onPlayerStateChange,
            },
          });
        });
      };

      vimeoVideos = () => {
        let playerContainer = this.querySelector(".player-container"),
          getVimeoId = this.VimeoVideo.dataset.vimeoid,
          vimeoAutoplay = this.VimeoVideo.dataset.vimeoautoplay,
          vimeoMuted = this.VimeoVideo.dataset.vimeomuted,
          circlePlaying = this.querySelector(".thumbnail-wrapper-id"),
          SecondplayBtn = this.querySelector(".second_play-btn");

        let options = {
          url: `https://vimeo.com/${getVimeoId}`,
          autoplay: false,
          controls: false,
          muted: vimeoMuted,
        };
        let player = new Vimeo.Player(playerContainer, options);
        function isVideoPlaying() {
          return player.getPaused().then(function (paused) {
            return !paused;
          });
        }
        if (vimeoAutoplay == "true" && vimeoMuted == "true") {
          player.play();
          SecondplayBtn.style.opacity = "0";
          SecondplayBtn.classList.add("show_btn");
        } else {
          this.circlePlayButton.addEventListener("click", function () {
            isVideoPlaying().then(function (playing) {
              if (!playing) {
                player.play();
                circlePlaying.style.display = "none";
                SecondplayBtn.style.opacity = "0";
                SecondplayBtn.classList.add("show_btn");
              }
            });
          });
        }

        SecondplayBtn.addEventListener("click", function () {
          isVideoPlaying().then(function (playing) {
            if (playing) {
              player.pause();
              SecondplayBtn.style.opacity = "1";
            } else {
              player.play();
              SecondplayBtn.style.opacity = "0";
            }
          });
        });
      };
    }
    customElements.define("video-hero", videoHero);
  }
});
