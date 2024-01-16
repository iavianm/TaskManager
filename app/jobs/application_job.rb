class ApplicationJob
  include Sidekiq::Worker
  include Sidekiq::Throttled::Worker
  sidekiq_options lock: :until_and_while_executing, on_conflict: { client: :log, server: :reject }
end
