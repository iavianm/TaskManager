class Web::ApplicationController < ApplicationController
  after_action -> { flash.discard }, if: -> { request.xhr? || request.format.html? }
end
