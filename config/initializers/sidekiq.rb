require 'sidekiq/web'
require "sidekiq/throttled"
require "sidekiq/throttled/web"
require 'sidekiq_unique_jobs/web'

Sidekiq.configure_server do |config|
  config.redis = { url: ENV['REDIS_URL'] }
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV['REDIS_URL'] }
end

Sidekiq::Throttled::Registry.add(:mailer, { threshold: { limit: 1, period: 5.seconds } })
