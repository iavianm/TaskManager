class Api::V1::ApplicationController < Api::ApplicationController
  RANSACK_DEFAULT_SORT = 'id DESC'.freeze

  def self.responder
    JsonResponder
  end

  def build_meta(collection)
    {
      count: collection.count,
      total_count: collection.total_count,
      current_page: collection.current_page,
      total_pages: collection.total_pages,
      per_page: collection.limit_value,
    }
  end

  def ransack_params
    search_params = params.fetch(:q, {}).permit!.to_h
    search_params[:s] ||= RANSACK_DEFAULT_SORT
    search_params
  end

  def page
    params.fetch(:page, 1)
  end

  def per_page
    per = params.fetch(:per_page, 10).to_i
    per > 100 ? 100 : per
  end
end
